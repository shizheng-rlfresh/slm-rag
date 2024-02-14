<script>
    // Define your navigation link here
    export let name;
    export let url;
</script>

<nav class="bg-white shadow-md">
    <div class="mx-auto max-w-6xl px-4">
        <div class="flex justify-between">
            <div class="flex space-x-4">
                <!-- logo -->
                <div>
                    <a
                        href={url}
                        class="flex items-center px-2 py-5 text-gray-700 hover:text-gray-900"
                    >
                        <svg
                            class="mr-1 h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                        <span class="font-bold">{name}</span>
                    </a>
                </div>
                <!-- primary nav -->
                <!-- <div class="hidden items-center space-x-1 md:flex">
                    <a href={url} class="px-3 py-5 text-gray-700 hover:text-gray-900">{name}</a>
                </div> -->
            </div>
            <!-- mobile button goes here -->
        </div>
    </div>
</nav>
