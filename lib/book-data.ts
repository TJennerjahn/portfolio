export type BookData = {
  title: string;
  imageUrl: string;
  description: string;
  pageCount: string;
  isbn_13: string;
  authors: string[];
};

export const EMPTY_BOOK_DATA: BookData = {
  title: "",
  imageUrl: "",
  description: "",
  pageCount: "",
  isbn_13: "",
  authors: [],
};
