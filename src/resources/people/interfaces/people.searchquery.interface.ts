interface SearchQuery {
    search_continent?: string | undefined;
    search_country?: string | undefined;
    sortby?: string;
    options: {
        page: number | undefined;
        limit: number | undefined;
    }
}


export default SearchQuery;