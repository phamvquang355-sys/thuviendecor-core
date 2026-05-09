"use client"

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface HeroSlide {
  id: number | string
  url?: string
  image_url?: string
  alt?: string
  title?: string
}

export function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  useEffect(() => {
    async function fetchSlides() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('Error fetching hero slides:', error)
      } else if (data && data.length > 0) {
        setSlides(data)
      }
      setLoading(false)
    }

    fetchSlides()
  }, [])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (loading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto md:py-8">
        <div className="overflow-hidden md:rounded-2xl shadow-2xl relative h-[70vh] min-h-[500px] bg-gray-100 animate-pulse">
        </div>
      </div>
    )
  }

  if (slides.length === 0) return null

  return (
    <div className="relative w-full max-w-7xl mx-auto md:py-8">
      {/* Slider Viewport */}
      <div className="overflow-hidden md:rounded-2xl shadow-2xl relative" ref={emblaRef}>
        <div className="flex h-[70vh] min-h-[500px]">
          {slides.map((slide, index) => (
            <div className="relative flex-[0_0_100%] min-w-0" key={slide.id}>
              <Image
                src={slide.url || slide.image_url || ''}
                alt={slide.alt || slide.title || 'Hero slide'}
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
