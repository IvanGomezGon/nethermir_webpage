<template>
    <section class="">
        <div class="px-4 mx-auto max-w-screen-xl lg:py-6 ">
            <div class="mx-auto  text-center">
                <h1
                    class="pb-4 mb-4 text-5xl tracking-tight font-extrabold lg:text-7xl text-primary-600 dark:text-primary-500">
                    Creant la teva màquina virtual</h1>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    style="margin: auto; background: none; display: block; shape-rendering: auto;" width="200px"
                    height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                    <circle cx="84" cy="50" r="10" fill="#225445">
                        <animate attributeName="r" repeatCount="indefinite" dur="0.8333333333333334s" calcMode="spline"
                            keyTimes="0;1" values="10;0" keySplines="0 0.5 0.5 1" begin="0s"></animate>
                        <animate attributeName="fill" repeatCount="indefinite" dur="3.3333333333333335s" calcMode="discrete"
                            keyTimes="0;0.25;0.5;0.75;1" values="#225445;#82dbb8;#53ab8b;#157759;#225445" begin="0s">
                        </animate>
                    </circle>
                    <circle cx="16" cy="50" r="10" fill="#225445">
                        <animate attributeName="r" repeatCount="indefinite" dur="3.3333333333333335s" calcMode="spline"
                            keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
                        <animate attributeName="cx" repeatCount="indefinite" dur="3.3333333333333335s" calcMode="spline"
                            keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
                    </circle>
                    <circle cx="50" cy="50" r="10" fill="#157759">
                        <animate attributeName="r" repeatCount="indefinite" dur="3.3333333333333335s" calcMode="spline"
                            keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.8333333333333334s">
                        </animate>
                        <animate attributeName="cx" repeatCount="indefinite" dur="3.3333333333333335s" calcMode="spline"
                            keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.8333333333333334s">
                        </animate>
                    </circle>
                    <circle cx="84" cy="50" r="10" fill="#53ab8b">
                        <animate attributeName="r" repeatCount="indefinite" dur="3.3333333333333335s" calcMode="spline"
                            keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.6666666666666667s">
                        </animate>
                        <animate attributeName="cx" repeatCount="indefinite" dur="3.3333333333333335s" calcMode="spline"
                            keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.6666666666666667s">
                        </animate>
                    </circle>
                    <circle cx="16" cy="50" r="10" fill="#82dbb8">
                        <animate attributeName="r" repeatCount="indefinite" dur="3.3333333333333335s" calcMode="spline"
                            keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10"
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-2.5s"></animate>
                    <animate attributeName="cx" repeatCount="indefinite" dur="3.3333333333333335s" calcMode="spline"
                        keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84"
                        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-2.5s"></animate>
                </circle>
            </svg>
            <p class="pt-4 mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Aquest procès pot arribar a trigar un parell de minuts</p>
            <p class="mb-8 text-lg font-light text-gray-500 dark:text-gray-400">Si aquest procès triga massa temps, contacta al teu professor.
            </p>
        </div>
    </div>
</section></template>