<template>
  <div>
    <h1 class="text-2xl font-bold text-navy mb-6">Messages</h1>

    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden" style="height: calc(100vh - 200px);">
      <div class="flex h-full">
        <!-- Thread List -->
        <div :class="['w-full md:w-80 border-r border-gray-200 flex flex-col', activeThread ? 'hidden md:flex' : 'flex']">
          <!-- Search -->
          <div class="p-4 border-b border-gray-200">
            <input
              v-model="threadSearch"
              type="text"
              placeholder="Search conversations..."
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange outline-none"
            />
          </div>

          <!-- Thread Items -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="threadsLoading" class="p-4 space-y-4">
              <div v-for="i in 5" :key="i" class="flex gap-3 animate-pulse">
                <div class="w-10 h-10 bg-gray-200 rounded-full" />
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4" />
                  <div class="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
            <div v-else-if="!filteredThreads.length" class="p-8 text-center text-gray-400">
              <p>No conversations yet</p>
            </div>
            <button
              v-for="thread in filteredThreads"
              :key="thread.id"
              @click="selectThread(thread)"
              :class="[
                'w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors',
                activeThread?.id === thread.id ? 'bg-orange-lighter' : '',
              ]"
            >
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {{ thread.buyer_name.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="font-semibold text-navy text-sm truncate">{{ thread.buyer_name }}</p>
                    <span class="text-xs text-gray-400 whitespace-nowrap ml-2">{{ formatTime(thread.last_message_at) }}</span>
                  </div>
                  <p class="text-xs text-gray-500 truncate">{{ thread.listing_title }}</p>
                  <p class="text-sm text-gray-600 truncate mt-0.5">{{ thread.last_message }}</p>
                </div>
                <span v-if="thread.unread_count" class="bg-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  {{ thread.unread_count }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Conversation Area -->
        <div :class="['flex-1 flex flex-col', !activeThread ? 'hidden md:flex' : 'flex']">
          <template v-if="activeThread">
            <!-- Conversation Header -->
            <div class="flex items-center gap-3 p-4 border-b border-gray-200">
              <button @click="activeThread = null" class="md:hidden text-gray-400 hover:text-navy">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <div class="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-semibold text-sm">
                {{ activeThread.buyer_name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-navy">{{ activeThread.buyer_name }}</p>
                <p class="text-xs text-gray-500 truncate">Re: {{ activeThread.listing_title }}</p>
              </div>
            </div>

            <!-- Messages -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
              <div v-if="messagesLoading" class="flex justify-center py-8">
                <svg class="animate-spin h-6 w-6 text-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <template v-else>
                <div
                  v-for="msg in messages"
                  :key="msg.id"
                  :class="['flex', msg.is_mine ? 'justify-end' : 'justify-start']"
                >
                  <div :class="[
                    'max-w-[70%] rounded-2xl px-4 py-3',
                    msg.is_mine ? 'bg-navy text-white rounded-br-md' : 'bg-gray-100 text-navy rounded-bl-md',
                  ]">
                    <p class="text-sm leading-relaxed">{{ msg.body }}</p>
                    <p :class="['text-xs mt-1', msg.is_mine ? 'text-gray-300' : 'text-gray-400']">
                      {{ formatTime(msg.created_at) }}
                    </p>
                  </div>
                </div>
              </template>
            </div>

            <!-- Reply Input -->
            <div class="p-4 border-t border-gray-200">
              <form @submit.prevent="sendMessage" class="flex gap-3">
                <input
                  v-model="replyText"
                  type="text"
                  placeholder="Type your message..."
                  class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-orange outline-none text-navy text-sm"
                  @keyup.enter="sendMessage"
                />
                <button
                  type="submit"
                  :disabled="!replyText.trim() || sendingMessage"
                  class="bg-orange hover:bg-orange-light text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  Send
                </button>
              </form>
            </div>
          </template>

          <!-- No Thread Selected -->
          <div v-else class="flex-1 flex items-center justify-center text-gray-400">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="font-medium">Select a conversation</p>
              <p class="text-sm mt-1">Choose a thread from the left to view messages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'seller',
  middleware: 'seller',
})

const { $api } = useNuxtApp()

interface Thread {
  id: number
  buyer_name: string
  listing_title: string
  last_message: string
  last_message_at: string
  unread_count: number
}

interface Message {
  id: number
  body: string
  is_mine: boolean
  created_at: string
}

const threads = ref<Thread[]>([])
const messages = ref<Message[]>([])
const activeThread = ref<Thread | null>(null)
const threadSearch = ref('')
const replyText = ref('')
const threadsLoading = ref(true)
const messagesLoading = ref(false)
const sendingMessage = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const filteredThreads = computed(() => {
  if (!threadSearch.value) return threads.value
  const q = threadSearch.value.toLowerCase()
  return threads.value.filter(
    (t) => t.buyer_name.toLowerCase().includes(q) || t.listing_title.toLowerCase().includes(q),
  )
})

const formatTime = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffHours < 1) return `${Math.round(diffMs / (1000 * 60))}m ago`
  if (diffHours < 24) return `${Math.round(diffHours)}h ago`
  if (diffHours < 48) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const fetchThreads = async () => {
  threadsLoading.value = true
  try {
    const res = await $api<{ data: Thread[] }>('/seller/messages/threads')
    threads.value = res.data
  } catch {
    threads.value = []
  } finally {
    threadsLoading.value = false
  }
}

const selectThread = async (thread: Thread) => {
  activeThread.value = thread
  messagesLoading.value = true
  try {
    const res = await $api<{ data: Message[] }>(`/seller/messages/threads/${thread.id}`)
    messages.value = res.data
    thread.unread_count = 0
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  } catch {
    messages.value = []
  } finally {
    messagesLoading.value = false
  }
}

const sendMessage = async () => {
  if (!replyText.value.trim() || !activeThread.value) return
  sendingMessage.value = true
  try {
    const res = await $api<{ data: Message }>(`/seller/messages/threads/${activeThread.value.id}`, {
      method: 'POST',
      body: { body: replyText.value },
    })
    messages.value.push(res.data)
    replyText.value = ''
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  } catch {
    // Error sending message
  } finally {
    sendingMessage.value = false
  }
}

onMounted(() => fetchThreads())

useHead({
  title: 'Messages - MenonTrucks',
})
</script>
