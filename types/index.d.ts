export interface FilterList {
  rowId: number;
  field: typeof AccountStatsType | string;
  operator: string;
  value: string;
  combine: "and" | "or";
  label: string;
}

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

import Account from "@/app/(dashboard)/accounts/account/[id]/page";
import ProductDataBase from "@/app/(dashboard)/products/product-database/product-database";
import { Icons } from "@/components/icons";

export interface SubRoute {
  title: string;
  description: string;
  href: string;
  icon: keyof typeof Icons;
}

export interface SideNavRoute {
  title: string;
  iconName: keyof typeof Icons;
  href: string;
  subPages?: SubRoute[];
  disabled: boolean;
}

export interface DashboardConfig {
  sideNav: SideNavRouteProps[];
}

type TableHeader = {
  primaryHeaders: {
    title: string;
  }[];
  secondaryHeaders: {
    title: string;
    value?: string;
  }[];
};

export type ComboBoxType = {
  title: string;
  items: {
    title: string;
    icon?: keyof typeof Icons | string;
    value: string | number;
    disabled?: boolean;
  }[];
};

type FilterOptions = {
  fields: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  operators: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
};

export interface AccountDatabaseConfig {
  tableHeaders: TableHeader;
  filterOptions: FilterOptions;
  sortOptions: ComboBoxType;
}

export interface AccountCollectionConfig {
  tableHeaders: TableHeader;
  sortOptions: ComboBoxType;
}

export type CollectionType = {
  id: string;
  name: string;
  ids: string[];
  first3Items?: {
    id: string;
    avatar: string;
  }[];
};

export type AccountCollectionData = {
  collection: CollectionType;
  accounts: AccountDataType[];
};

export interface AccountStatsType {
  dataCollectionTime: number;
  followerCount: number;
  followingCount: number;
  heartCount: number;
  videoCount: number;
  diggCount: number;
}

export interface ProductType {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  title: string;
  image: string;
  supplierUrl: string;
  accounts: string[];
}

export interface ProductDataBaseType {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  title: string;
  image: string;
  supplierUrl: string;
  supplierInfo: any;
  accounts: AccountDataType[];
}

export interface PostType {
  collectionId: string;
  collectionName: string;
  cover: string;
  created: string;
  expand: any;
  id: string;
  postData: any;
  postId: string;
  updated: string;
}

export interface AccountDataType {
  recordId: string;
  id: string;
  uniqueId: string;
  nickname: string;
  accountStats: AccountStatsType[];
  stats: {
    heartCount: number;
    followerCount: number;
    followingCount: number;
    videoCount: number;
  };
  avatar: string;
  secUid: string;
  bio: string;
  bioLink: string;
  posts: any;
  topPosts: PostType[] | undefined;
  product: ProductType | undefined;
}

interface Post {
  postId: string;
  cover: string;
  postData: {
    collectCount: number;
    commentCount: number;
    diggCount: number;
    playCount: number;
    shareCount: number;
  };
}

interface Price {
  id: string;
  unit_amount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  monthly_price: Price;
  annual_price: Price;
  features: feature[];
  firebaseRole: string;
}

export interface feature {
  text: string;
  footnote?: string;
  negative?: boolean;
}

export type ProductType = {
  accounts: string[];
  collectionId: string;
  collectionName: string;
  created: string;
  expand: any;
  id: string;
  image: string;
  supplierUrl: string;
  title: string;
  updated: string;
};

export interface ProductType {
  accounts: string[];
  image: string;
  supplierId: string;
  updated: string;
  supplierUrl: string;
  id: string;
  title: string;
  supplierInfo: SupplierInfo;
  accountsData: AccountDataType[];
}

export interface SupplierInfo {
  supplierTitle: string;
  supplierImages: string[];
  supplierPrice: {
    min: number;
    max: number;
  };
}

export interface AccountStatsResponse {
  stats: {
    diggCount: number;
    followerCount: number;
    followingCount: number;
    heart: number;
    heartCount: number;
    videoCount: number;
  };
  user: {
    avatarLarger: string;
    avatarMedium: string;
    avatarThumb: string;
    commentSetting: number;
    downloadSetting: number;
    duetSetting: number;
    ftc: boolean;
    id: string;
    isADVirtual: boolean;
    nickname: string;
    openFavorite: boolean;
    privateAccount: boolean;
    relation: number;
    secUid: string;
    secret: boolean;
    signature: string;
    stitchSetting: number;
    ttSeller: boolean;
    uniqueId: string;
    verified: boolean;
  };
}

interface AccountDataType {
  accountStats: AccountStatsType[];
  avatar: string;
  id: string;
  product: ProductType;
  secUid: string;
  storeUrl: string;
  topPosts: Post[];
  uniqueId: string;
  userInfo: any;
}
