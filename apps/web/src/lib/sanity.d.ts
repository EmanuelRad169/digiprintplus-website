export declare const sanityClient: import("@sanity/client").SanityClient;
export declare const sanityClientNoToken: import("@sanity/client").SanityClient;
export declare const getSanityClient: () => import("@sanity/client").SanityClient;
export declare function createQuoteRequest(formData: any): Promise<{
    success: boolean;
    data: import("@sanity/client").SanityDocument<{
        _type: string;
        status: string;
        priority: string;
        contact: {
            firstName: any;
            lastName: any;
            email: any;
            phone: any;
            company: any;
        };
        jobSpecs: {
            productType: any;
            quantity: any;
            size: any;
            paperType: any;
            finish: any;
            turnaround: any;
            additionalNotes: any;
        };
        submittedAt: string;
    }>;
    error?: undefined;
} | {
    success: boolean;
    error: unknown;
    data?: undefined;
}>;
//# sourceMappingURL=sanity.d.ts.map