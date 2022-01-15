interface SearchQuery {
    search_continent?: string | undefined;
    search_country?: string | undefined;
    search_text?: string;
    linkedin_url?: string;
    first_name?: string;
    last_name?: string;
    sortby?: string; // custom sort
    options: {
        page: number | undefined;
        limit: number | undefined;
    }
}


export default SearchQuery;