/*
 * Copyright 2018 Nicolas Lochet Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

const ParamCheck = require('./ParamCheck')

class NumberCheck extends ParamCheck {
  static build(k) {
    return new NumberCheck(k)
  }
  async validate(store, param) {
    let val = this.extractParam(param)
    return typeof val === 'number'
  }
  predicate(f) {
    return new CheckNumDecorator(this.k, this, f)
  }
  asInt() {
    return new CheckNumDecorator(this.k, this, Number.isInteger)
  }
  min(v) {
    return new CheckNumDecorator(this.k, this, x => x >= v)
  }
  max(v) {
    return new CheckNumDecorator(this.k, this, x => x <= v)
  }
}

class CheckNumDecorator extends NumberCheck {
  constructor(k, d, f) {
    super(k)
    this.d = d
    this.f = f
  }
  async validate(store, param) {
    if(await this.d.validate(store, param)) {
      let v = this.extractParam(param)
      return this.f(v)
    }
  }
}

module.exports = NumberCheck