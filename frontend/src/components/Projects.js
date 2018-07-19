import el from "@scripts/el";
import generateId from "@scripts/generateId";

el.create("Projects", {
  constructor(props) {
    this.on("add", props.onAdd);
    this.on("select", props.onSelect);
  },

  select(project) {
    this.trigger("select", project);
    this.refs.list.children.forEach(function (child) {
      if (child.props.id !== project.id) {
        child.deselect();
      } else {
        child.select();
      }
    });
  },

  refresh(projects) {
    this.refs.list.html("");
    projects.forEach(project => {
      this.refs.list.append(
        el("Project", {
          id: project.id,
          value: project.value,
          onClick: () => this.select(project)
        })
      );
    });
  },

  addProject() {
    this.trigger("add", {
      id: generateId(),
      value: this.refs.project.value()
    });
    this.refs.project.value("");
  },

  onKeydown(e) {
    if (e.which === 13) {
      this.addProject();
    }
  },

  render() {
    return el("div", {
      class: "projects"
    }, [
        el("div", {
          class: "projects_name"
        }, [
            el("Input", {
              type: "text",
              ref: "project",
              onKeydown: (e) => this.onKeydown(e)
            }, [
                el("Icon", {
                  name: "folder-add"
                }),
                el("Button", {
                  class: "projects_add",
                  onClick: () => this.addProject()
                }, [
                    el("Icon", {
                      name: "add"
                    })
                  ])
              ]),
          ]),
        el("div", {
          ref: "list",
          class: "projects_list"
        })
      ]);
  }
});