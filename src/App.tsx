import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { title } from 'process';

interface IRenderItemProp { // I + [ten Component] + prop  // E (Enum - dinh danh gia tri)
  id: any;
  name: any;
  images: any;
  title: any;
  price: any;
  onChange?: Function;
  onChange2: Function;
}
interface ISearchItemProp {
  //value: string,
  valueSearch?: any;
  handleSearch?: Function
}
const Product = (props: IRenderItemProp ) => {
  return <div className="col-product">
    <div className='img'><img src={props.images[0]} alt={props.title} /></div>
    <div className='desc'>
      <h4 className='name'>{props.title}</h4>
      <div className='price'>{props.price}</div>
    </div>
  </div>
}
function Search(props: ISearchItemProp) {
  const [inputSearch, setInputSearch] = React.useState("");
  const onClickSearch = () => {
    props.handleSearch && props.handleSearch(inputSearch);
    console.log(inputSearch);
  }
  return (
      <div className='box-search'>
        <input className='input-search'
                placeholder="Bạn muốn tìm gì?"
                ref={focusUsernameInputField}
                value={inputSearch}
                onChange={(event:any)=>setInputSearch(event.target.value)} />
        <button className='btn-search' onClick={onClickSearch}>Search</button>
      </div>
  )
}
const focusUsernameInputField = (input: any) => {
  if (input) {
    input.focus()
  }
};
function App() {
  const [isShow, onSetShow] = useState(false);
  return (
    <div>
      <button className={`button ${isShow ? ' hide' : ''}`}  onClick={() => onSetShow(!isShow)}>Click</button>
      {isShow ? <MyComponent /> : null}
    </div>
  );
}
export default App;

const MyComponent = () => {
  const [data, setData] = useState([] as any[]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as any);
  const [offset, setOffset] = useState(0);
  const loaderRef = useRef(null as any);

  const [dataSearch, setDataSearch] = useState([] as any[]);
  
  useEffect(() => {
    //console.log("Mouted")

    // Call the fetchData function when the component mounts
    fetchData();

    // const options = {
    //   root: null,
    //   rootMargin: '0px',
    //   threshold: 1.0,
    // };
    // const handleIntersection = (entries: any) => {
    //   const [entry] = entries;
    //   if (entry.isIntersecting) {
    //     setOffset((offset) => offset + 1);
    //   }
    // };

    // const observer = new IntersectionObserver(handleIntersection, options);
    // if (loaderRef.current) {
    //   observer.observe(loaderRef.current);
    // }
    
    // return () => {
    //   console.log("UnMouted")
    //   if (loaderRef.current) {
    //     observer.unobserve(loaderRef.current);
    //   }
    // }

  }, []); 

  // Function to fetch data from the API
  const fetchData = async (offsetNew = 1) => {
    try {
      // Set loading state to true while fetching data
      setIsLoading(true);
      // Make the API request
      const response = await fetch(`https://api.escuelajs.co/api/v1/products?offset=${offsetNew}&limit=10`);
      // Check if the request was successful (status code 200)
      if (!response.ok) {
        throw new Error('Failed to fetch data'); // Handle error if the request was not successful
      }
      const result = await response.json();
      // Set the fetched data in the state
      setData((data) => [...data, ...result]);
    } catch (error) {
      // If an error occurs, set the error state
      setError(error);
    } finally {
      // Set loading state to false after fetching data (whether successful or not)
      setIsLoading(false);
    }
  };
  const fetchDataSearch = async (faram : any) => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.escuelajs.co/api/v1/products/?title=${faram}`);
      if(!response.ok){
        throw new Error('Lỗi');
      }
      const result = await response.json();
      setData(result);
    } catch (error){
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }


  // Render loading state if data is still being fetched
  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // Render error message if an error occurred
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const onSearchItem = (value: string) => {
    const listData = [...dataSearch];
    const listDataNew = listData.filter((el) => el.title !== value); 
    setDataSearch(listDataNew);
  }

  // Render the fetched data
  return (
    <div>
      <div className='wrapper'>
       <h1>Danh sach san pham</h1>
       {error
         ? <div>Error</div>
         : <div>
            <Search handleSearch={(a: string) => fetchDataSearch(a)} />
            <div className="d-flex list-product">
              {data.map(item => {
                const key = item.id;
                return <Product key={key} id={item.id} name={item.name} images={item.images[0]} title={item.title} price={item.price} onChange2={onSearchItem} />
              })}
            </div>
            <div ref={loaderRef} style={{ height: '50vh' }}></div>
           {/* <button onClick={() => setOffset(offset + 10)} >{isLoading ? "load" : "Xem them"}</button> */}
          </div>
        }
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {/* <button onClick={() => setOffset(offset+5)} >Xem them</button> */}
    </div>
  );
};
