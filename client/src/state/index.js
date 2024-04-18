import { createSlice } from "@reduxjs/toolkit"

const intitialState = {
    token:null,
    user:null,
    menuDishes:[],
    buffets:[],
    extras:[],
    cart:null
}
const authSlice = createSlice(
    {
        name: "auth",
        intitialState,
        reducers :{
            setLogUser:(state,action)=>{
                state.user = action.payload.user
            },
            setLogin:(state,action)=>{
                state.token=action.payload.token
            },
            setLogout:(state,action)=>{
                state.token = null
                state.user=null
                state.cart=null
            },
            setMenu:(state,action)=>{
                state.menuDishes = action.payload.menuDishes
            },
            setBuffets:(state,action)=>{
                state.buffets = action.payload.buffets
            },
            setExtras:(state,action)=>{
                state.extras = action.payload.extras
            },
            setCart:(state,action)=>{
                state.cart = action.payload.cart
            },
            editCart:(state,action)=>{
                const {itemId,updatedData} = action.payload
                state.cart={
                    ...state.cart,
                    items:state.cart.items.map(item=>item.id === itemId ? { ...item, ...updatedData } : item)
                }
            },
            emptyCart:(state)=>{
                state.cart.items = []
            }
            
        }
    }
)

export const {setLogin,setLogout,setMenu,setLogUser,setExtras,setBuffets,setCart,editCart,emptyCart} = authSlice.actions
export default authSlice.reducer