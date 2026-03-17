import React, { useState, useEffect, useRef } from "react";
import { ref, onValue, set, remove, get, update } from "firebase/database";
import { db } from "./FirebaseCfg";
import Swal from "sweetalert2";

export default function Outputs(props) {
  const {
    title,
    price,
    taxes,
    ads,
    discount,
    total,
    count,
    category,
    cleanData,
    handleProduct,
  } = props;

  const refOne = useRef(null);
  const [products, setProducts] = useState();
  const [noData, setNoData] = useState();
  const [btnUpdate, setBtnUpdate] = useState();
  const [idUpdated, setIdUpdated] = useState();
  const [productRes, setProductRes] = useState();

  //*Get Products
  const getProducts = () => {
    const productRef = ref(db, "Products/");

    onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        setProducts(null);
        setNoData("no");
      } else {
        let cleanData = Object.entries(data);
        setProducts(cleanData);
      }
    });
  };

  //* Create Product
  const createProduct = (e) => {
    e.preventDefault();

    const newPro = {
      title: title,
      price: price,
      taxes: taxes,
      ads: ads,
      discount: discount,
      total: total,
      count: count,
      category: category,
    };

    if (title === '' || price === ''|| count === '' || category === '') {
      Swal.fire("Please Fill All information", "", "error");
    } else {
      let workRef = ref(
        db,
        "Products/" + Math.floor(Math.random() * 1000).toString()
      );

      set(workRef, newPro);

      Swal.fire("Work added", "", "success");
      cleanData();
    }
  };

  // * Delete Product
  const deleteProduct = async (e, id, count) => {
    e.preventDefault();
    let productRef = ref(db, "Products/" + id);

    if (count > 1) {
      const snapshot = await get(productRef);
      const data = snapshot.val();

      var inputValue = data.count;
      const inputStep = 1;

      Swal.fire({
        title: "Select how many products you want to keep",
        html: `
         <input
           type="number" 
           value="${inputValue}"
           step="${inputStep}"
           class="swal2-input"
           id="range-value" /><br/>
           <h5>Choose 0 if you want to delete all products</h5>`,
        input: "range",
        inputValue,
        inputAttributes: {
          min: 0,
          max: data.count,
          step: inputStep,
        },
        showCancelButton: true,
        didOpen: () => {
          const inputRange = Swal.getInput();
          const inputNumber =
            Swal.getHtmlContainer().querySelector("#range-value");

          // remove default output
          inputRange.nextElementSibling.style.display = "none";
          inputRange.style.width = "100%";

          // sync input[type=number] with input[type=range]
          inputRange.addEventListener("input", () => {
            inputNumber.value = inputRange.value;
          });

          // sync input[type=range] with input[type=number]
          inputNumber.addEventListener("change", () => {
            inputRange.value = inputNumber.value;
          });
        },
      }).then((num) => {

        if (num.isConfirmed) {
          if (+num.value === 0) {
            remove(productRef);
          } else {
            update(productRef, {
              title: data.title,
              price: data.price,
              taxes: data.taxes,
              ads: data.ads,
              discount: data.discount,
              total: data.total,
              count: num.value,
              category: data.category,
            });
          }
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure ?",
        text: "You will not be able to recover this product !",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: " No , Keep it ",
        confirmButtonText: "Yes , delete it !",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          let productRef = ref(db, "Products/" + id);
          remove(productRef);
        } else {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your product is safe !',
            showConfirmButton: false,
            timer: 1500
          })
          
        }
      });
    }
  };

  // * Delete All Product
  const deleteAllProduct = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure ?",
      text: "You will not be able to recover this products !",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: " No , Keep it All ",
      confirmButtonText: "Yes , delete it All!",
    }).then((result) => {
      if (result.isConfirmed) {
        let productRef = ref(db, "Products/");
        remove(productRef);
        Swal.fire("Deleted!", "All products have been deleted.", "success");
      } else {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your product is safe !',
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  };

  // *Update Product
  const updateProduct = (e, id, product) => {
    e.preventDefault();

    setBtnUpdate("update");
    setIdUpdated(id);
    handleProduct(product);
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  // *Conceled
  const canceled = (e) => {
    e.preventDefault();
    cleanData();
    setBtnUpdate("");
    setIdUpdated("");
  };
  // *updated
  const updated = (e) => {
    e.preventDefault();
    let productRef = ref(db, "Products/" + idUpdated);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Product has been updated successfully",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      update(productRef, {
        title: title,
        price: price,
        taxes: taxes,
        ads: ads,
        discount: discount,
        total: total,
        count: count,
        category: category,
      });
      cleanData();
      setBtnUpdate("");
    });
  };

  //*Search Product
  const searchProduct = (e) => {
    e.preventDefault();
    setProductRes(products);
    const legendTfr = document.getElementById("legend");
    const inputTfr = document.getElementById("inputSearch");

    if (e.target.id === "SearchByTitle") {
      legendTfr.innerText = "Search By Title";
      inputTfr.placeholder = "";
      inputTfr.disabled = false;
      inputTfr.focus();
    } else if (e.target.id === "SearchByCategory") {
      legendTfr.innerText = "Search By Category";
      inputTfr.placeholder = "";
      inputTfr.disabled = false;
      inputTfr.focus();
    }
    document.addEventListener("click", handleClickOutsite, true);
  };
  //*Search Function
  const searchFN = (e) => {
    let inputTxt = e.target.value.trim();
    const methSearch = document.getElementById("legend").textContent;

    if (inputTxt === "") {
      setProducts(productRes);
    } else {
      if (methSearch === "Search By Title") {
        let result = productRes.filter((pro) =>
          pro[1].title.includes(inputTxt)
        );
        setProducts(result);
      } else if (methSearch === "Search By Category") {
        let result = productRes.filter((pro) =>
          pro[1].category.includes(inputTxt)
        );
        setProducts(result);
      }
    }
  };

  // *lost Pointer of input search
  const handleClickOutsite = (e) => {
    if (!refOne.current.contains(e.target)) {
      document.getElementById("legend").innerText = "Search";
      document.getElementById("inputSearch").placeholder =
        "Choose type of search";
      document.getElementById("inputSearch").disabled = true;
    }
  };

  //*Use Effect
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="outputs">
      {btnUpdate === "update" ? (
        <div className="upCancel">
          <button onClick={(e) => updated(e)}>Update</button>
          <button onClick={(e) => canceled(e)}>Cancel</button>
        </div>
      ) : (
        <button onClick={createProduct}>Create</button>
      )}

      <div className="searchBlock">
        <fieldset>
          <legend id="legend"> Search </legend>
          <div>
            <input
              type="text"
              disabled
              id="inputSearch"
              onChange={(e) => searchFN(e)}
              placeholder="Choose type of search"
              ref={refOne}
            />
            <div className="btnSearch">
              <button onClick={(e) => searchProduct(e)} id="SearchByTitle">
                Search By Title
              </button>
              <button onClick={(e) => searchProduct(e)} id="SearchByCategory">
                Search By Category
              </button>
            </div>
          </div>
        </fieldset>
      </div>
      {products === null || products === undefined ? (
        noData === "no" ? (
          <div>
            <h3 className="loading"> No Data </h3>
          </div>
        ) : (
          <div>
            <h3 className="loading"> Loading ...</h3>
          </div>
        )
      ) : (
        <>
          <div className="deleteAll">
            <button onClick={(e) => deleteAllProduct(e)}>
              Delete All ({products.length})
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>title</th>
                <th>price</th>
                <th>taxes</th>
                <th>ads</th>
                <th>discount</th>
                <th>total</th>
                <th>Count</th>
                <th>category</th>
                <th>update</th>
                <th>delete</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map((pro, index) => (
                  <tr key={index} >
                    <td>{index + 1}</td>
                    <td>{pro[1].title}</td>
                    <td>{pro[1].price}</td>
                    <td>{pro[1].taxes}</td>
                    <td>{pro[1].ads}</td>
                    <td>{pro[1].discount}</td>
                    <td>{pro[1].total}</td>
                    <td>{pro[1].count}</td>
                    <td>{pro[1].category}</td>

                    <td>
                      <button onClick={(e) => updateProduct(e, pro[0], pro[1])}>
                        update
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={(e) => deleteProduct(e, pro[0], pro[1].count)}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
