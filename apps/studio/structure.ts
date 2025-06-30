import { StructureBuilder } from 'sanity/desk'

export const getDefaultDocumentNode = (S: StructureBuilder, { schemaType }: { schemaType: string }) => {
  return S.document()
}

export default (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // 🛍️ Products Group
      S.listItem()
        .title('🛍️ Products')
        .child(
          S.list()
            .title('Products')
            .items([
              S.documentTypeListItem('product'),
              S.documentTypeListItem('productCategory'),
              S.documentTypeListItem('template'),
              S.documentTypeListItem('templateCategory'),
            ])
        ),

      // � Site Content Group
      S.listItem()
        .title('📝 Site Content')
        .child(
          S.list()
            .title('Site Content')
            .items([
              S.documentTypeListItem('aboutSection'),
              S.documentTypeListItem('contactInfo'),
              S.documentTypeListItem('ctaSection'),
              S.documentTypeListItem('faqItem'),
              S.documentTypeListItem('heroSlide'),
              S.documentTypeListItem('footer'),
            ])
        ),

      // ⚙️ Site Settings
      S.listItem()
        .title('⚙️ Site Settings')
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.documentTypeListItem('siteSettings'),
              S.documentTypeListItem('pageSettings'),
              S.documentTypeListItem('aboutPage'),
              S.documentTypeListItem('quoteSettings'),
              S.documentTypeListItem('navigationMenu'),
              S.documentTypeListItem('integrationSettings'),
            ])
        ),

      // � Requests & Users
      S.listItem()
        .title('� Requests & Users')
        .child(
          S.list()
            .title('Data')
            .items([
              S.documentTypeListItem('quoteRequest'),
              S.documentTypeListItem('user'),
            ])
        ),

      // 🧪 Experiments (can be hidden in prod)
      ...(process.env.NODE_ENV === 'development' ? [
        S.listItem()
          .title('🧪 Experiments')
          .child(
            S.list()
              .title('Experimental')
              .items([
                S.documentTypeListItem('testDoc'),
                S.documentTypeListItem('service'),
              ])
          ),
      ] : []),

      // Media (leave at bottom)
      S.documentTypeListItem('media'),
    ])
