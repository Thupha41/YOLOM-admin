const formatCurrency = (number) => {
  return new Intl.NumberFormat("vi-VN").format(number);
};

export default formatCurrency;
