const initialState = {
  category: '',
  filter: '',
  order: '',
  orderby: '',
  offset: 0,
  totalProduct: 0,
  banner: true,
};

const filterReducer = (state = initialState, action) => {
  if (action.type === 'SET_FILTER') {
    return {
      category: action.payload.category,
      filter: action.payload.filter,
      order: action.payload.order,
      orderby: action.payload.orderby,
      offset: action.payload.offset,
      totalProduct: action.payload.totalProduct,
      banner: action.payload.banner,
    };
  }
  if (action.type === 'UNSET_FILTER') {
    return initialState;
  }
  return state;
};

export default filterReducer;
