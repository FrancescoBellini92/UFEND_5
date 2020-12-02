class BaseModel {
  _initProps(input) {
    const props = Object.getOwnPropertyNames(this);
    props.forEach((prop) => (this[prop] = input[prop]));
  }
}

module.exports = BaseModel;
