import { getFramePaths } from '@/lib/frames';
import { getBiodata } from '@/lib/parseBiodata';
import ScrollyCanvas from '@/components/ScrollyCanvas';
import BiodataSection from '@/components/Biodata';
import ProfileGallery from '@/components/ProfileGallery';

export default function Home() {
  const framePaths = getFramePaths();
  const biodata = getBiodata();

  return (
    <main className="min-h-screen bg-[#121212]">
      {/* 
        The canvas takes up the first 500vh of the page.
        The layout shift is prevented as it's fully self-contained. 
      */}
      <ScrollyCanvas framePaths={framePaths} />
      
      {/* 
        The biodata triggers as we scroll past the 500vh mark. 
      */}
      <BiodataSection data={biodata} />
      
      {/* 
        Profile gallery and socials at the bottom. 
      */}
      <ProfileGallery />
    </main>
  );
}
