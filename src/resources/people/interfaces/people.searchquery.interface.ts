interface SearchQuery {
    search_continent?: string | undefined; //remove this
    search_country?: string | undefined; // remove this
    search_text?: string;
    linkedin_url?: string;
    job_title?: string;
    job_company_name?: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    summary?: string | boolean;
    sortby?: string; // custom sort
    archive?: boolean;
    excel_data?: [];
    columns_to_fields?: any;
    options?: {
        page: number | undefined;
        limit: number | undefined;
    }
}


export default SearchQuery;