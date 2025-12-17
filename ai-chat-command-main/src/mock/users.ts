export interface Admin {
  id: number;
  name: string;
  username: string;
  password: string;
  avatar?: string;
}

export const admins: Admin[] = [
  { id: 1, name: "Alex Thompson", username: "admin1", password: "1234" },
  { id: 2, name: "Sarah Miller", username: "admin2", password: "1234" },
  { id: 3, name: "James Wilson", username: "admin3", password: "1234" }
];
