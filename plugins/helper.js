import { Internationalization } from '@syncfusion/ej2-base'
export default (context, inject) => {
  const intl = new Internationalization()
  const helper = {
    ucfirst (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    formatDateTime (date, tzString = 'Asia/Yangon', format = 'yyyy-MM-dd') {
      try {
        return intl.formatDate(typeof date === 'string' ? new Date(date) : date, {
          format
        })
      } catch (e) {
        return 'Invalid Date'
      }
      // return this.intl.formatDate(new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', { timeZone: tzString })), {
      //   format: format
      // })
    },
    getDate (date, format = 'yyyy-MM-dd') {
      return this.formatDateTime(date, '', format)
    },
    getTime (date, format = 'HH:mm:ss') {
      return this.formatDateTime(date, '', format)
    },
    reduceToString (arr, field) {
      const reducer = (prevVal, currVal, idx, arr) => {
        return idx === 0 ? currVal[field] : prevVal + ', ' + currVal[field]
      }
      return arr.reduce(reducer, '')
    },
    timeStringToMinutes (str) {
      const words = str.split(':')
      let minutes = 0
      minutes += Number(words[0]) * 60
      minutes += Number(words[1])
      return minutes
    },
    minutesToTimeString (minutes) {
      const minNum = parseInt(minutes, 10)
      let hours = Math.floor(minNum / 60)
      let min = Math.floor((minNum - (hours * 60)))

      if (hours < 10) { hours = '0' + hours }
      if (min < 10) { min = '0' + min }
      return hours + ':' + min + ':00'
    },
    round (num, interval) {
      return Math.round(num / interval) * interval
    },
    ceil (num, interval) {
      return Math.ceil(num / interval) * interval
    }
  }

  inject('helper', helper)
}
