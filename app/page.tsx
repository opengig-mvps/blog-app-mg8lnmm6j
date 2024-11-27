'use client' ;
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, User, Star } from "lucide-react"
import { gsap } from "gsap"
import { useEffect } from "react"

const LandingPage = () => {
  useEffect(() => {
    gsap.to(".fade-in", {
      opacity: 1,
      duration: 1.5,
      stagger: 0.5,
      ease: "power2.out",
    })
  }, [])

  return (
    <div className="flex flex-col min-h-[100vh] bg-gradient-to-b from-[#f8fafc] to-[#e0f2f1]">
      <main className="flex-1">
        <section className="w-full py-16 md:py-32 lg:py-48 text-center">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-6 fade-in opacity-0">
              <h1 className="text-5xl font-bold tracking-tight text-[#1a202c] sm:text-6xl">
                Welcome to the Blogging World
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-[#2d3748]">
                Create and explore amazing blogs with ease. Dive into a world of written wonders.
              </p>
              <Button className="mt-5 bg-[#3182ce] text-white hover:bg-[#2b6cb0]">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-32 bg-white fade-in opacity-0">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-10 text-center">
              <div className="space-y-2 fade-in opacity-0">
                <h2 className="text-4xl font-bold tracking-tight text-[#1a202c]">
                  Featured Blogs
                </h2>
                <p className="max-w-xl mx-auto text-md text-[#2d3748]">
                  Explore some of the top-rated blogs from our community.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((id) => (
                  <Card className="fade-in opacity-0" key={id}>
                    <CardHeader className="flex items-center justify-between">
                      <CardTitle>Blog Title {id}</CardTitle>
                      <Badge variant="outline">Popular</Badge>
                    </CardHeader>
                    <CardContent>
                      <p>
                        This is a brief description of Blog {id}. Dive deeper to read the full article.
                      </p>
                      <Avatar>
                        <AvatarImage src="https://via.placeholder.com/64" />
                        <AvatarFallback>AU</AvatarFallback>
                      </Avatar>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-32 bg-gradient-to-r from-[#e6fffa] to-[#b2f5ea] fade-in opacity-0">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <Star className="w-12 h-12 text-[#2c7a7b]" />
              <h2 className="text-4xl font-bold tracking-tight text-[#1a202c]">
                Join Our Community
              </h2>
              <p className="max-w-md mx-auto text-md text-[#2d3748]">
                Be part of a vibrant community of writers and readers. Share your thoughts and engage with others.
              </p>
              <Button className="bg-[#38b2ac] text-white hover:bg-[#319795]">
                Sign Up Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4">
            <User className="w-8 h-8 text-[#2d3748]" />
            <p className="text-[#2d3748]">
              © 2023 Blogging World. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage