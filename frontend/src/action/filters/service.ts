import { store } from "@frontend/store";
import { CategoryResponse } from '@types';
import ajax from "@ajax";
import _ from "lodash";
import generateHash from "@generate-hash";
import { FilterResponse } from "@types";

function getElementByID<T extends { id: string }>(list: T[], id: string): T {
  return list.find((a) => a.id === id);
}

export interface FilterServiceCreateValue {
  name: string;
  categoryID: string;
}

export interface FilterServiceEditValue {
  name?: string;
  categoryID: string;
  filterID: string;
  tags: string[];
}

export class FilterService {
  createFilter(value: FilterServiceCreateValue) {
    const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const categoryElement = categories.find((a) => a.id === value.categoryID);

    const filter: FilterResponse = {
      created: new Date().getTime(),
      id: generateHash(),
      name: value.name,
      tags: [],
    };

    categoryElement.filters.push(filter);

    store.set({
      todo: {
        categories
      }
    });

    ajax.post(`/filters/${value.categoryID}`, {
      data: {
        action: "create",
        name: value.name,
      }
    })
      .then((filterResponse: FilterResponse) => {
        const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
        const categoryElement = getElementByID(categories, value.categoryID);
        const filterIndex = categoryElement.filters.findIndex((a) => a.id === filter.id);
        categoryElement.filters[filterIndex] = filterResponse;
        store.set({
          todo: {
            categories,
          }
        });
      })
      .catch((res: string) => {
        const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
        const categoryElement = getElementByID(categories, value.categoryID);
        const filterIndex = categoryElement.filters.findIndex((a) => a.id === filter.id);
        console.error(res);
        categoryElement.filters.splice(filterIndex, 1);
        store.set({
          todo: {
            categories,
          }
        });
      });
  }

  editFilter(value: FilterServiceEditValue) {
    const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const categoryElement = categories.find((a) => a.id === value.categoryID);
    const nextFilterElement = _.merge({}, categoryElement.filters.find((a) => a.id === value.filterID)) as FilterResponse;
    const prevFilterElement = categoryElement.filters.find((a) => a.id === value.filterID);
    const filterIndex = categoryElement.filters.indexOf(prevFilterElement);

    nextFilterElement.tags = value.tags || nextFilterElement.tags;
    nextFilterElement.name = value.name || nextFilterElement.name;
    categoryElement.filters[filterIndex] = nextFilterElement;

    store.set({
      todo: {
        categories
      }
    });

    ajax.post(`/filters/${value.categoryID}/${value.filterID}`, {
      data: {
        action: "edit",
        name: value.name,
        tags: value.tags,
      }
    }).catch((res: string) => {
      const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
      const categoryElement = categories.find((a) => a.id === value.categoryID);
      categoryElement.filters[filterIndex] = prevFilterElement;
      store.set({
        todo: {
          categories
        }
      });
      console.error(res);
    });
  }
}