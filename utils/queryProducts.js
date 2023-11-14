class queryProducts {
    products = []
    query = {}
    constructor(products, query) {
        this.products = products
        this.query = query
    }

    categoryQuery = () => {
        this.products = this.query.category ? this.products.filter((c) => c.category === this.query.category) : this.products
        return this
    }

    ratingQuery = () => {
        this.products = this.query.rating ? this.products.filter((r) => parseInt(this.query.rating) <= r.rating && r.rating < parseInt(this.query.rating) + 1) : this.products
        return this
    }

    priceQuery = () => {
        this.products = this.products.filter((p) => p.price >= this.query.lowPrice && p.price <= this.query.highPrice)
        return this
    }

    sortByPrice = () => {
        if (this.query.sortPrice) {
            if (this.query.sortPrice === 'low-to-high') {
                this.products = this.products.sort(function (a, b) { return a.price - b.price })
            } else {
                this.products = this.products.sort(function (a, b) { return b.price - a.price })
            }
        }
        return this
    }

    skip = () => {
        let { pageNumber } = this.query;
        const skipPage = (parseInt(pageNumber) - 1) * this.query.perPage

        let skipProducts = []

        for (let i = skipPage; i < this.products.length; i++) {
            skipProducts.push(this.products[i])
        }
        this.products = skipProducts
        return this
    }

    limit = () => {
        let temp = []
        if (this.products.length > this.query.perPage) {
            for (let i = 0; i < this.query.perPage; i++) {
                temp.push(this.products[i])
            }
        } else {
            temp = this.products
        }
        this.products = temp
        return this
    }

    getProducts = () => {
        return this.products
    }

    countProducts = () => {
        return this.products.length;
    }
}

module.exports = queryProducts
