interface Asset {
  url: string;
  type: string;
}

interface Game {
  id: number;
  title_tm: string;
  title_en: string;
  title_ru: string;
  assets: Asset[];
}

interface Category {
  id: number;
  name_tm: string;
  name_ru: string;
  name_en: string;
  desc_tm: string;
  desc_en: string;
  desc_ru: string;
  image: string;
  created_at: string;
  update_at: string;
}

export interface CategoryData {
  category: Category;
  games: Game[];
}
