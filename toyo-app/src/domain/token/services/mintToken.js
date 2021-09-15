import axios from "axios";

export async function mintToken(typeId, quantity) {
  const url = `http://localhost:8080/template/token `;

  return await axios
    .post(url, {
      typeId: typeId,
      quantity: quantity,
    })
    .then((response) => {
      return response.data[0];
    })
    .catch((error) => console.log(error));
}
