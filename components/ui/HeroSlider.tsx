"use client"

import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const HERO_SLIDES = [
  { id: 1, url: '/image/hero/slide-1.jpg', alt: 'Tiệc cưới ngoài trời lãng mạn' },
  { id: 2, url: '/image/hero/slide-2.jpg', alt: 'Kiến trúc sân khấu sự kiện' },
  { id: 3, url: '/image/hero/slide-3.jpg', alt: 'Trang trí bàn tiệc sang trọng' },
  { id: 4, url: '/image/hero/slide-4.jpg', alt: 'Không gian tiệc cưới cổ điển' },
  { id: 5, url: '/image/hero/slide-5.jpg', alt: 'Ánh sáng sự kiện' }
]

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative w-full max-w-7xl mx-auto md:py-8">
      {/* Slider Viewport */}
      <div className="overflow-hidden md:rounded-2xl shadow-2xl relative" ref={emblaRef}>
        <div className="flex h-[70vh] min-h-[500px]">
          {HERO_SLIDES.map((slide, index) => (
            <div className="relative flex-[0_0_100%] min-w-0" key={slide.id}>
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex flex-col justify-end items-center pb-24 px-6 text-center">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-md tracking-tight leading-tight">
                  DULI - THƯ VIỆN TÀI NGUYÊN SỰ KIỆN
                </h1>
                <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl font-light drop-shadow">
                  Nâng tầm thiết kế của bạn với hàng ngàn mô hình 3D, Vector 2D và hình ảnh chất lượng cao chuyên biệt cho ngành cưới hỏi & sự kiện.
                </p>
                <Link
                  href="/library"
                  className="bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:bg-accent-gold hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
                >
                  Khám phá ngay
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-accent-gold hover:border-accent-gold hover:text-black z-10"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-accent-gold hover:border-accent-gold hover:text-black z-10"
          aria-label="Ảnh tiếp"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
