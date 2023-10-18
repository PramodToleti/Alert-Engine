import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import * as z from "zod"

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

import { targets } from "../constants/index"
import Editor from "./Editor"
import { formSchema } from "@/schema/schema"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useLocation, useNavigate } from "react-router-dom"
import { PolicyData } from "@/types/types"

const PolicyForm = () => {
  const organization = useAppSelector((state) => state.organization.value)
  const zones = useAppSelector((state) => state.zones.zones)
  const sites = useAppSelector((state) => state.sites.sites)
  const roles = useAppSelector((state) => state.roles.roles)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const policyData = location.state as PolicyData
  let polData: PolicyData
  if (policyData) {
    polData = policyData
  } else {
    polData = {
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
    }
  }
  const [data, setData] = useState<PolicyData>(polData)
  const dispatch = useAppDispatch()

  {
    /* Fetch Zones */
  }
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

  {
    /* Fetch Sites */
  }
  useEffect(() => {
    async function fetchSites() {
      const response = await fetch(
        `http://localhost:5000/api/sites/${data.zone_id}`
      )
      const responseData = await response.json()
      dispatch({ type: "sites/setSites", payload: responseData })
    }
    fetchSites()
  }, [organization, data.zone_id, dispatch])

  {
    /* Fetch Roles */
  }
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`http://localhost:5000/api/roles`)
      const responseData = await response.json()
      dispatch({ type: "roles/setRoles", payload: responseData })
    }
    fetchUsers()
  }, [dispatch])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
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

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    /* alert(JSON.stringify(data, null, 2)) */
    setData(data)
    setLoading(true)
    if (location.pathname === "/policies/new") {
      const response = await fetch("http://localhost:5000/api/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      console.log(responseData)
      if (response.ok) {
        setLoading(false)
        toast.success("Policy Created Successfully")
        setTimeout(() => {
          navigate("/policies")
        }, 1000)
      } else {
        setLoading(false)
        toast.error("Policy Creation Failed")
      }
    } else {
      const response = await fetch(
        `http://localhost:5000/api/policies/${policyData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )

      const responseData = await response.json()
      console.log(responseData)
      if (response.ok) {
        setLoading(false)
        toast.success("Policy Updated Successfully")
      } else {
        setLoading(false)
        toast.error("Policy Updation Failed")
      }
    }
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the Zone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {zones.length > 0 ? (
                            zones.map((each) => (
                              <SelectItem value={each._id} key={each._id}>
                                {each.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" key="0">
                              No Zones Found
                            </SelectItem>
                          )}
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the Zone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {zones.length > 0 ? (
                              zones.map((each) => (
                                <SelectItem value={each._id} key={each._id}>
                                  {each.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" key="0">
                                No Zones Found
                              </SelectItem>
                            )}
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the Site" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sites.length > 0 ? (
                              sites?.map((each) => (
                                <SelectItem value={each._id} key={each._id}>
                                  {each.site_name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" key="0">
                                No Sites Found
                              </SelectItem>
                            )}
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
            {fields?.map((field, index) => (
              <div key={field.id}>
                <FormField
                  control={control}
                  name={`mail_level_alert.${index}.user_role`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the User" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles?.map((each) => (
                              <SelectItem value={each.role_name} key={each._id}>
                                {each.role_name}
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

            <Button type="submit" className="w-full mt-10 text-center">
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : location.pathname === "/policies/new" ? (
                "Create"
              ) : (
                "Update"
              )}
            </Button>
          </form>
        </Form>
      </Card>

      <Editor data={data} />
    </div>
  )
}

export default PolicyForm
