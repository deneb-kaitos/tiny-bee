import package_json from '../../../package.json';

let siteInfoStore = null;

class SiteInfo {
  #state = $state.frozen(new Map());

  constructor() {
    this.#state = structuredClone(package_json.siteInfo);
  }

  get Title() {
    return this.#state.title;
  }
}

if (siteInfoStore === null) {
  siteInfoStore = new SiteInfo();
}

export const SiteInfoStore = siteInfoStore;
