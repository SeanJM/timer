import Service from "./service";
const service = new Service();
export default function (subscribe) {
  subscribe("CREATE_TAG", (e) => service.createTag(e));
}
