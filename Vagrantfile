# The Vagrantfile is only used to easily spin up a simple ubuntu development box with docker installed

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.box_check_update = true
  config.vm.network "private_network", ip: "192.168.33.10"
  config.vbguest.auto_update = true

  config.vm.provider :virtualbox do |vm|
      vm.memory = 1024
      vm.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.provision "shell", path: "bootstrap-vm.sh"
end
