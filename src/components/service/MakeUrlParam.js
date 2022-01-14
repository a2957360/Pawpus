export default function encodeQueryData(data) {
  const ret = [];
  for (let d in data) {
    if (!data[d] || data[d].length === 0) {
      // console.log("empty", d, data[d]);
    } else {
      // console.log("this is d1", d, data[d]);
      ret.push(
        encodeURIComponent(d) +
          "=" +
          encodeURIComponent(JSON.stringify(data[d]))
      );
    }
  }
  return ret.join("&");
}
