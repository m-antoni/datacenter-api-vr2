interface SearchQuery {
    search: string | undefined;
    options: {
        page: number;
        limit: number
    }
}


export default SearchQuery;