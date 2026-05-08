import React from 'react'
import Image from 'next/image'
import { Database } from '@/types/database'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Resource = Database['public']['Tables']['resources']['Row']

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  // Placeholder image if no preview_url is provided
  const imageUrl = resource.preview_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'

  return (
    <Card className="overflow-hidden break-inside-avoid mb-6 bg-white border-gray-200 transition-all hover:shadow-lg group">
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        <Image
          src={imageUrl}
          alt={resource.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badge phân loại */}
        <div className="absolute top-3 left-3 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
          {resource.category}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1">
          {resource.title}
        </h3>
        <p className="text-sm text-gray-500 font-medium">
          {resource.price_credits === 0 ? 'Miễn phí' : `${resource.price_credits} Credits`}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-gray-900 text-white transition-colors duration-300 hover:bg-accent-gold hover:text-black font-semibold"
        >
          Chi tiết
        </Button>
      </CardFooter>
    </Card>
  )
}
