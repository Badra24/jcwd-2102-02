export const sortOptions = [
  {
    value: "relevance",
    label: "Relevance",
    order: "",
    orderby: "",
  },
  {
    value: "total_paymentdesc",
    label: "Highest total_payment",
    order: "DESC",
    orderby: "total_payment" ,
  },
  {
    value: "total_paymenteasc",
    label: "Lowest total_payment",
    order: "ASC",
    orderby: "total_payment",
  },
  {
    value: "createdAtdesc",
    label: "dateDown",
    order: "DESC",
    orderby: "createdAt" ,
  },
  {
    value: "createdAtasc",
    label: "dateUp",
    order: "ASC",
    orderby: "createdAt" ,
  },

  { value: "nameasc", label: "A-Z", order: "ASC", orderby: "name" },
  { value: "namedesc", label: "Z-A", order: "DESC", orderby: "name" },
];
