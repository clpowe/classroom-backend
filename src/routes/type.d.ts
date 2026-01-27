type Schedule = {
  day: string;
  startTime: string;
  endTime: string;
};

export type UserRoles = "admin" | "teacher" | "student";

export type RateLimitRole = UserRoles | "guest";
