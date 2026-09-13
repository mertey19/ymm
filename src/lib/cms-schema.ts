import { z } from 'zod';
const short = z.string().trim().min(1).max(200);
const paragraph = z.string().trim().min(1).max(10000);
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Adres yalnızca küçük harf, rakam ve tire içerebilir.')
  .max(120);
export const cmsSchema = z
  .object({
    settings: z.object({
      phone: z
        .string()
        .trim()
        .max(50)
        .regex(/^[+\d\s().-]*$/),
      email: z.union([z.literal(''), z.string().email().max(200)]),
      address: z.string().trim().max(1000),
      workingHours: z.string().trim().max(200),
      heroTitle: short,
      heroDescription: paragraph,
      aboutTitle: short,
      aboutText: paragraph,
    }),
    services: z
      .array(
        z.object({
          slug,
          title: short,
          shortTitle: short,
          intro: paragraph,
          scope: z.array(short).min(1).max(30),
          benefits: z.array(short).min(1).max(30),
          audience: paragraph,
          faq: z.array(z.object({ question: short, answer: paragraph })).max(20),
        }),
      )
      .min(1)
      .max(30),
    publications: z
      .array(
        z.object({
          slug,
          title: short,
          description: paragraph,
          category: short,
          date: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .refine(
              (v) => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().startsWith(v),
              'Geçerli bir tarih girin.',
            ),
          kind: z.enum(['sirkulerler', 'makaleler']),
          demo: z.boolean(),
          published: z.boolean(),
          body: z
            .array(z.object({ heading: short, text: paragraph }))
            .min(1)
            .max(50),
        }),
      )
      .max(500),
    team: z
      .array(
        z.object({
          id: short,
          name: short,
          title: short,
          bio: z.string().max(5000),
          partner: z.boolean(),
          published: z.boolean(),
        }),
      )
      .max(100),
  })
  .superRefine((data, ctx) => {
    for (const key of ['services', 'publications', 'team'] as const) {
      const ids = data[key].map((x) =>
        'slug' in x ? ('kind' in x ? `${x.kind}/${x.slug}` : x.slug) : x.id,
      );
      if (new Set(ids).size !== ids.length)
        ctx.addIssue({
          code: 'custom',
          path: [key],
          message: 'Aynı adres veya kimlik birden fazla kayıtta kullanılamaz.',
        });
    }
  });
export type CmsDocument = z.infer<typeof cmsSchema>;
export type CmsState = { data: CmsDocument; revision: number; updatedAt: string | null };
