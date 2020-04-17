export const initialState = {
  isLoading: false,
  error: null,
  stuff: null
};

const apiReducer = (state, action) => {
  switch (action.type) {
    case "PENDING":
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case "post":
      return {
        ...state,
        isLoading: false,
        error: null,
        stuff: { ...state.stuff, datumList: [action.payload, ...state.stuff.datumList] }
      };

    case "get":
      return {
        ...state,
        isLoading: false,
        error: null,
        stuff: action.payload
      };

    case "put":
      return {
        ...state,
        isLoading: false,
        error: null,
        stuff: { ...state.stuff, datumList: state.stuff.datumList.map(x => (x.id === action.id ? action.payload : x)) }
      };

    case "delete":
      return {
        ...state,
        isLoading: false,
        error: null,
        stuff: { ...state.stuff, datumList: state.stuff.datumList.filter(x => x.id !== action.id) }
      };

    case "REJECTED":
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default apiReducer;