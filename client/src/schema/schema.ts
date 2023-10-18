import * as z from "zod"


export const formSchema = z.object({
    name: z.string().min(5),
    target: z.string().min(1),
    org_id: z.string().min(1),
    zone_id: z.string().min(0),
    site_id: z.string().min(0),
    app_level_alert: z.object({
      freq: z.coerce.number().min(1),
    }),
    mail_level_alert: z.array(
      z.object({
        user_role: z.string().min(1),
        alert_time: z.string().nonempty(),
        freq: z.coerce.number().min(1),
        wait_time: z.coerce.number().min(0),
      })
    ),
  })