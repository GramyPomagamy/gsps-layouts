export interface Bid {
    fields: {
        state: string
        parent: any
        name: any
        shortdescription: string
        total: number
        game: string
        category: string
        endTime: string
        public: any
        istarget: boolean
        goal: string | number
    }
    pk: number
}
