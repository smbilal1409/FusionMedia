import API from "./config.api";
export const healthcheck={
healthcarecheck:()=>API.get("/healthcare/healthcarecheck")
}