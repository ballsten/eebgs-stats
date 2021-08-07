-<template>
  <table class="table is-striped is-fullwidth">
    <thead>
      <tr>
        <th v-for="header in headers" :key="header.field">
          {{ header.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in displayItems" :key="index">
        <td v-for="header in headers" :key="header.field">
          {{ format(header, item) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    headers: Array,
    items: Array,
    limit: Number,
    sortColumn: {
      type: Number,
      default() {
        return 1
      },
    },
    sortOrder: {
      validator(value) {
        return ['ASC', 'DESC'].includes(value)
      },
      default() {
        return 'ASC'
      },
    },
  },
  computed: {
    displayItems() {
      let sortField = this.headers[this.sortColumn - 1].field

      if ((this.sortOrder == 'ASC')) {
        return this.items
          .sort((a, b) => b[sortField] < a[sortField])
          .slice(0, this.limit)
      } else {
        return this.items
          .sort((a, b) => b[sortField] > a[sortField])
          .slice(0, this.limit)
      }
    },
  },
  methods: {
    format(header, item) {
      let value = item[header.field]
      if (header.hasOwnProperty('type')) {
        if (header.type == Number) {
          if (header.hasOwnProperty('fixed')) {
            value = value.toFixed(header.fixed)
          }
        }
      }
      return value
    },
  },
}
</script>