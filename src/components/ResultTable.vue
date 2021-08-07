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
    <tfoot v-if="limit">
      <tr>
        <td :colspan="this.headers.length">
          <button
            class="button is-fullwidth"
            @click="limitToggle = !limitToggle"
          >
            {{ limitToggle ? 'Less' : 'More' }}
          </button>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
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
  data() {
    return {
      internalSortColumn: this.sortColumn,
      internalSortOrder: this.sortOrder,
      limitToggle: false,
    }
  },
  computed: {
    displayItems() {
      let sortField = this.headers[this.internalSortColumn - 1].field

      let displayTable

      if (this.internalSortOrder == 'ASC') {
        displayTable = this.items.sort((a, b) => b[sortField] < a[sortField])
      } else {
        displayTable = this.items.sort((a, b) => b[sortField] > a[sortField])
      }

      if(!this.limitToggle && this.limit) {
        displayTable = displayTable.slice(0, this.limit)
      }

      return displayTable
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