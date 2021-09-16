import axios from "axios";

export async function mintToken(address, typeId, quantity) {
  const url = `http://localhost:8080/template/token `;

  console.log('ADDRESS: ', address);

  return await axios
    .post(url, {
      wallet: address,
      typeId: typeId,
      quantity: quantity,
    })
    .then((response) => {
      return response.data[0];
    })
    .catch((error) => console.log(error));
}
