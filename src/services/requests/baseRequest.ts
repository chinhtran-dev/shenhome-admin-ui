interface Direction {
    field: string;
    direction: string;
}

export class SearchRequest {
    paging: boolean;
    filter?: Map<string, string>;
    sort?: Direction[];
    pageNum?: number;
    pageSize?: number;

    constructor(
        paging: boolean = true,
        filter?: Map<string, string>,
        sort?: Direction[],
        pageNum?: number,
        pageSize?: number
    ) {
        this.paging = paging;
        this.filter = filter;
        this.sort = sort;
        this.pageNum = pageNum;
        this.pageSize = pageSize;
    }
}