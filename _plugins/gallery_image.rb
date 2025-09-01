module Jekyll
  module GalleryImages
    def images_in_folder(folder)
      Dir.glob(File.join(folder, "*.{jpg,jpeg,png,gif}")).map do |f|
        f.sub(/^.*?assets\//, 'assets/')
      end.sort
    end
  end
end

Liquid::Template.register_filter(Jekyll::GalleryImages)