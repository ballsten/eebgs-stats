-<template>
  <table class="table is-striped is-fullwidth">
    <thead>
      <tr>
        <th
          v-for="(header, index) in headers"
          :key="header.field"
          @click="sort(index)"
        >
          {{ header.label }}
          <span v-show="index == this.internalSortColumn - 1" class="icon">
            <i :class="sortClass"></i>
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in displayItems" :key="index">
        <td v-for="header in headers" :key="header.field">
          <template v-if="header.routeTo">
            <router-link :to="routeTo(header, item)">
              {{ format(header, item) }}
            </router-link>
          </template>
          <template v-else>
            {{ format(header, item) }}
          </template>
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
      let sortField = this.headers[this.internalSortColumn - 1].sortField || this.headers[this.internalSortColumn - 1].field

      let displayTable

      if (this.internalSortOrder == 'ASC') {
        displayTable = this.items.sort((a, b) => b[sortField] < a[sortField])
      } else {
        displayTable = this.items.sort((a, b) => b[sortField] > a[sortField])
      }

      if (!this.limitToggle && this.limit) {
        displayTable = displayTable.slice(0, this.limit)
      }

      return displayTable
    },
    sortClass() {
      if (this.internalSortOrder === 'ASC') {
        return 'fas fa-sort-up'
      } else {
        return 'fas fa-sort-down'
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
    sort(index) {
      // if already sorting on the column, change the order
      if (this.internalSortColumn == index + 1) {
        if (this.internalSortOrder === 'ASC') {
          this.internalSortOrder = 'DESC'
        } else {
          this.internalSortOrder = 'ASC'
        }
      } else {
        // change the sort column
        this.internalSortColumn = index + 1
      }
    },
    routeTo(header, item) {
      return {
        name: header.routeTo.name,
        // calculate params
        params: Object.fromEntries(Object.entries(header.routeTo.params).map(x => x[1] = [x[0],item[x[0]]]))
      }
    }
  },
}
</script>