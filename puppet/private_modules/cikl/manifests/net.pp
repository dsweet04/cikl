define cikl::net (
  $mode,
  $ip = undef,
  $netmask = undef,
  $metric = 100,
  $enabled = true
)
{

  validate_re($mode, [ '^dhcp$', '^static$'] )

  # Convert $enabled into a boolean
  $is_enabled = $enabled ? {
    'true'  => true,
    'false' => false,
    default => $enabled
  }

  validate_bool($is_enabled)
  if ($mode == 'static') {
    validate_re($ip, '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')
    validate_re($netmask, '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')
  }

  if ($metric != undef) {
    validate_re("${metric}", '^[0-9]+$')
  }

  $iface_startup_content = $is_enabled ? {
    true    => "auto ${name}",
    default =>  ""
  }

  $iface_config_content = $mode ? {
    'static' => "iface ${name} inet static
  address ${ip}
  netmask ${netmask}",
    'dhcp' => "iface ${name} inet dhcp"
  }

  file { "cikl::net ${name} config":
    path => "/etc/network/interfaces.d/${name}.cfg",
    content => "# Generated by cikl::net puppet script
${iface_startup_content}
${iface_config_content}
  metric ${metric}
"
  }

  exec { "cikl::net stop ${name}": 
    refreshonly => true,
    subscribe   => File["cikl::net ${name} config"],
    command     => "/sbin/ifdown ${name}",
  }

  if ($is_enabled == true) {
    exec { "cikl::net start ${name}": 
      refreshonly => true,
      subscribe   => Exec["cikl::net stop ${name}"],
      command     => "/sbin/ifup ${name}",
    }
  }
}


