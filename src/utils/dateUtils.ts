export const formateDate = (date: Date | undefined) => {
  if (date) {
    const dateTemp = new Date(date);
    let formatedDate = `${dateTemp.getMonth() + 1}/${dateTemp.getDate()}/${dateTemp.getFullYear()}`;
    return formatedDate;
  } else {
    return "N/A";
  }
}

  export const handleDateConvert = (date: Date | undefined) => {
    let dateTemp = date ? new Date(date) : new Date();
    return dateTemp;
  }
