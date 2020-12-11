<template>
  <v-list dense nav>
    <v-list-item
    :to="item.path"
    link v-for="item in navItems"
    :key="item.title"
    >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
</template>

<script>

export default {
  data () {
    return {
      navItems: [
        {
          title: 'Главная',
          icon: 'mdi-home-variant',
          path: '/'
        }, {
          title: 'Обратная связь',
          icon: 'mdi-forum',
          path: '/feedback'
        }, {
          title: 'Настройки',
          icon: 'mdi-cog',
          path: '/settings'
        }
      ]
    }
  }
}
</script>
