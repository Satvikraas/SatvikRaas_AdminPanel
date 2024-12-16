import EditableProduct from './EditableProduct';

import './ProductList.css';

const AProductList = ({ products }) => {
  

  return (
    <div className="product-list2">
      
      {products.map((product,i) => (
        <EditableProduct key={i} product={product} />
      ))}
    </div>
  );
};

export default AProductList;