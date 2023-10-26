import { Uid } from "@react_db_client/constants.client-types";

export class Page {
  uid: Uid;
  page: React.ReactNode;
  constructor(uid, page) {
    this.uid = uid;
    this.page = page;
  }
}

export default Page;
