export const getSidebarItems = () => [
  { type: "main", label: "Dashboard", link: "/dashboard", icon: "🏠" },
  {
    type: "dropdown",
    label: "Vehicles",
    icon: "🚗",
    subItems: [
      { label: "View List", link: "/vehicles" },
      { label: "Create Vehicle", link: "/vehicles/create" },
    ],
  },
  {
    type: "dropdown",
    label: "Users",
    icon: "👤",
    subItems: [
      { label: "User List", link: "/user-details" },
      { label: "Create User", link: "/user-create" },
    ],
  },
];
