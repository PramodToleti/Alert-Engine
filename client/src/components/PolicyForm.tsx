import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"

import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

import { targets, user_roles } from "../constants/index"
import Editor from "./Editor"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"

const formSchema = z.object({
  name: z.string().min(5),
  target: z.string().min(1),
  org_id: z.string().min(1),
  zone_id: z.string().min(1),
  site_id: z.string().min(1),
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

const PolicyForm = () => {
  const organization = useAppSelector((state) => state.organization.value)
  const zones = useAppSelector((state) => state.zones.zones)
  const sites = useAppSelector((state) => state.sites.sites)
  const [data, setData] = useState({
    name: "",
    target: "",
    org_id: organization,
    zone_id: "",
    site_id: "",
    app_level_alert: {
      freq: 30,
    },
    mail_level_alert: [
      {
        user_role: "",
        alert_time: "09:00",
        freq: 30,
        wait_time: 0,
      },
    ],
  })
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function fetchZones() {
      if (!organization) return
      const response = await fetch(
        `http://localhost:5000/api/zones/${organization}`
      )
      const data = await response.json()
      dispatch({ type: "zones/setZones", payload: data })
    }
    fetchZones()
  }, [organization, dispatch])

  useEffect(() => {
    async function fetchSites() {
      const response = await fetch(
        `http://localhost:5000/api/sites/${data.zone_id}`
      )
      const responseData = await response.json()
      console.log(responseData)
      dispatch({ type: "sites/setSites", payload: responseData })
    }
    fetchSites()
  }, [organization, data.zone_id, dispatch])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      target: "",
      org_id: organization,
      zone_id: "",
      site_id: "",
      app_level_alert: {
        freq: 30,
      },
      mail_level_alert: [
        {
          user_role: "",
          alert_time: "09:00",
          freq: 30,
          wait_time: 0,
        },
      ],
    },
  })

  const { control, watch } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "mail_level_alert",
  })

  const watchedFields = watch([
    "name",
    "target",
    "zone_id",
    "site_id",
    "app_level_alert",
    "mail_level_alert",
  ])

  useEffect(() => {
    if (watchedFields[1] === "organization") {
      setData((prevData) => {
        return {
          ...prevData,
          name: watchedFields[0],
          target: watchedFields[1],
          org_id: organization,
          zone_id: "",
          site_id: "",
          app_level_alert: {
            freq: watchedFields[4]?.freq || 0,
          },
          mail_level_alert: watchedFields[5] || [],
        }
      })
    } else if (watchedFields[1] === "zone") {
      setData((prevData) => {
        return {
          ...prevData,
          name: watchedFields[0],
          target: watchedFields[1],
          org_id: organization,
          zone_id: watchedFields[2] || "",
          site_id: "",
          app_level_alert: {
            freq: watchedFields[4]?.freq || 0,
          },
          mail_level_alert: watchedFields[5] || [],
        }
      })
    } else {
      setData((prevData) => {
        return {
          ...prevData,
          name: watchedFields[0],
          target: watchedFields[1],
          org_id: organization,
          zone_id: watchedFields[2] || "",
          site_id: watchedFields[3] || "",
          app_level_alert: {
            freq: watchedFields[4]?.freq || 0,
          },
          mail_level_alert: watchedFields[5] || [],
        }
      })
    }
  }, [watchedFields, organization])

  /*  const availableUserRoles = useMemo(() => {
    const selectedUserRoles = fields.map((field) => field.user_role);
    return user_roles.filter(
      (role) =>
        !selectedUserRoles.includes(role.value) ||
        data.mail_level_alert.some((alert) => alert.user_role === role.value)
    );
  }, [fields, data]); */

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    alert(JSON.stringify(data, null, 2))
    setData(data)
  }

  return (
    <div className="md:flex gap-4 justify-center ">
      <Card className="p-6 w-full md:w-2/5 md:absolute md:left-28 top-28 max-h-[620px] overflow-scroll no-scrollbar">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Policy 1" {...field} />
                  </FormControl>
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.name?.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Target" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {targets.map((each) => (
                          <SelectItem value={each.value} key={each.value}>
                            {each.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {form.formState.errors.target && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.target?.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            {data.target === "zone" && (
              <FormField
                control={control}
                name="zone_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the Zone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {zones.map((each) => (
                            <SelectItem value={each._id} key={each._id}>
                              {each.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {form.formState.errors.zone_id && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.zone_id?.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            )}
            {data.target === "site" && (
              <>
                <FormField
                  control={control}
                  name="zone_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zone</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the Zone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {zones.map((each) => (
                              <SelectItem value={each._id} key={each._id}>
                                {each.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {form.formState.errors.zone_id && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.zone_id?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="site_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the Site" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sites.map((each) => (
                              <SelectItem value={each._id} key={each._id}>
                                {each.site_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {form.formState.errors.site_id && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.site_id?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className=" mt-15 mb-0">
              <FormLabel className="text-lg mt-8">App Alerts</FormLabel>
            </div>
            <FormField
              control={control}
              name="app_level_alert.freq"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency (in days)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Frequency"
                      type="number"
                      {...field}
                      min={1}
                    />
                  </FormControl>
                  {form.formState.errors.app_level_alert?.freq && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.app_level_alert?.freq?.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <div className="mt-15 mb-0">
              <FormLabel className="text-lg mt-8">Mail Level Alerts</FormLabel>
            </div>
            {fields.map((field, index) => (
              <div key={field.id}>
                <FormField
                  control={control}
                  name={`mail_level_alert.${index}.user_role`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the User" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {user_roles.map((each) => (
                              <SelectItem value={each.value} key={each.value}>
                                {each.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {form.formState.errors.mail_level_alert?.[index]
                        ?.user_role && (
                        <p className="text-red-500 text-sm">
                          {
                            form.formState.errors.mail_level_alert?.[index]
                              ?.user_role?.message
                          }
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`mail_level_alert.${index}.alert_time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Time (in hours)</FormLabel>
                      <FormControl>
                        <Input placeholder="9.0" {...field} type="time" />
                      </FormControl>
                      {form.formState.errors.mail_level_alert?.[index]
                        ?.alert_time && (
                        <p className="text-red-500 text-sm">
                          {
                            form.formState.errors.mail_level_alert?.[index]
                              ?.alert_time?.message
                          }
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`mail_level_alert.${index}.freq`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency (in days)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Frequency"
                          {...field}
                          type="number"
                          min={1}
                        />
                      </FormControl>
                      {form.formState.errors.mail_level_alert?.[index]
                        ?.freq && (
                        <p className="text-red-500 text-sm">
                          {
                            form.formState.errors.mail_level_alert?.[index]
                              ?.freq?.message
                          }
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`mail_level_alert.${index}.wait_time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wait Time (in days)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Wait Time"
                          {...field}
                          type="number"
                          min={0}
                        />
                      </FormControl>
                      {form.formState.errors.mail_level_alert?.[index]
                        ?.wait_time && (
                        <p className="text-red-500 text-sm">
                          {
                            form.formState.errors.mail_level_alert?.[index]
                              ?.wait_time?.message
                          }
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <div className="flex justify-between mt-4 mb-8">
                  {index === fields.length - 1 ? (
                    <Button
                      type="button"
                      className="mr-4"
                      onClick={() =>
                        append({
                          user_role: "",
                          alert_time: "09:00",
                          freq: 30,
                          wait_time: 0,
                        })
                      }
                    >
                      Add User
                    </Button>
                  ) : (
                    <p></p>
                  )}

                  {fields.length > 1 && (
                    <Button type="button" onClick={() => remove(index)}>
                      RemoveUser
                    </Button>
                  )}
                </div>
                {index !== fields.length - 1 && <hr className="my-4" />}
              </div>
            ))}

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </Card>

      <Editor data={data} />
    </div>
  )
}

export default PolicyForm
